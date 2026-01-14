#!/usr/bin/env node

/**
 * Fetch YouTube comments from all channel videos
 * Exports comments to JSON format for analysis/backup
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, '../src/data/youtube-comments.json');

// Configuration
const CONFIG = {
  fetchAllReplies: true,  // Fetch replies beyond the 5 inline ones
  delayMs: 100,           // Delay between API calls to avoid rate limits
};

/**
 * Delay helper for rate limiting
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format a comment from API response
 */
function formatComment(comment) {
  const snippet = comment.snippet;
  return {
    id: comment.id,
    author: {
      displayName: snippet.authorDisplayName,
      channelId: snippet.authorChannelId?.value || null,
      channelUrl: snippet.authorChannelUrl || null,
      profileImageUrl: snippet.authorProfileImageUrl || null,
    },
    text: snippet.textDisplay,
    textOriginal: snippet.textOriginal,
    publishedAt: snippet.publishedAt,
    updatedAt: snippet.updatedAt,
    likeCount: snippet.likeCount || 0,
  };
}

/**
 * Format a reply from API response
 */
function formatReply(reply) {
  const snippet = reply.snippet;
  return {
    id: reply.id,
    parentId: snippet.parentId,
    author: {
      displayName: snippet.authorDisplayName,
      channelId: snippet.authorChannelId?.value || null,
      channelUrl: snippet.authorChannelUrl || null,
      profileImageUrl: snippet.authorProfileImageUrl || null,
    },
    text: snippet.textDisplay,
    textOriginal: snippet.textOriginal,
    publishedAt: snippet.publishedAt,
    updatedAt: snippet.updatedAt,
    likeCount: snippet.likeCount || 0,
  };
}

/**
 * Fetch all videos from the channel
 */
async function getChannelVideos(youtube, channelId) {
  // Get channel's uploads playlist ID
  const channelResponse = await youtube.channels.list({
    part: 'contentDetails',
    id: channelId
  });

  if (!channelResponse.data.items?.length) {
    throw new Error('Channel not found');
  }

  const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

  // Fetch all videos from uploads playlist
  const allVideos = [];
  let nextPageToken = undefined;

  do {
    const playlistResponse = await youtube.playlistItems.list({
      part: 'snippet',
      playlistId: uploadsPlaylistId,
      maxResults: 50,
      pageToken: nextPageToken
    });

    for (const item of playlistResponse.data.items || []) {
      allVideos.push({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        publishedAt: item.snippet.publishedAt
      });
    }

    nextPageToken = playlistResponse.data.nextPageToken;
    if (nextPageToken) await delay(CONFIG.delayMs);
  } while (nextPageToken);

  return allVideos;
}

/**
 * Fetch all replies for a comment thread when there are more than 5
 */
async function fetchAllReplies(youtube, parentId, totalCount) {
  const replies = [];
  let nextPageToken = undefined;

  do {
    const response = await youtube.comments.list({
      part: 'snippet',
      parentId: parentId,
      maxResults: 100,
      pageToken: nextPageToken,
      textFormat: 'plainText'
    });

    for (const reply of response.data.items || []) {
      replies.push(formatReply(reply));
    }

    nextPageToken = response.data.nextPageToken;
    if (nextPageToken) await delay(CONFIG.delayMs);
  } while (nextPageToken && replies.length < totalCount);

  return replies;
}

/**
 * Fetch all comments for a video
 */
async function fetchCommentsForVideo(youtube, videoId) {
  const comments = [];
  let nextPageToken = undefined;

  try {
    do {
      const response = await youtube.commentThreads.list({
        part: 'snippet,replies',
        videoId: videoId,
        maxResults: 100,
        pageToken: nextPageToken,
        textFormat: 'plainText'
      });

      for (const thread of response.data.items || []) {
        const topLevelComment = thread.snippet.topLevelComment;
        const totalReplyCount = thread.snippet.totalReplyCount || 0;

        const comment = {
          ...formatComment(topLevelComment),
          totalReplyCount: totalReplyCount,
          replies: []
        };

        // Get inline replies first
        if (thread.replies?.comments) {
          comment.replies = thread.replies.comments.map(formatReply);
        }

        // Fetch additional replies if there are more than the inline 5
        if (CONFIG.fetchAllReplies && totalReplyCount > comment.replies.length) {
          comment.replies = await fetchAllReplies(youtube, topLevelComment.id, totalReplyCount);
        }

        comments.push(comment);
      }

      nextPageToken = response.data.nextPageToken;
      if (nextPageToken) await delay(CONFIG.delayMs);
    } while (nextPageToken);

    return { comments, disabled: false };

  } catch (error) {
    // Handle videos with disabled comments
    if (error.message?.includes('disabled') ||
        error.message?.includes('Comments are turned off') ||
        (error.code === 403 && error.message?.includes('commentsDisabled'))) {
      return { comments: [], disabled: true };
    }
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('💬 Fetching YouTube comments...\n');

  // Check for required environment variables
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey) {
    console.error('❌ YOUTUBE_API_KEY not found in environment variables');
    process.exit(1);
  }

  if (!channelId) {
    console.error('❌ YOUTUBE_CHANNEL_ID not found in environment variables');
    process.exit(1);
  }

  // Initialize YouTube API
  const youtube = google.youtube({
    version: 'v3',
    auth: apiKey
  });

  // Fetch all channel videos
  console.log('📡 Fetching channel videos...');
  const videos = await getChannelVideos(youtube, channelId);
  console.log(`   Found ${videos.length} videos\n`);

  // Initialize output structure
  const output = {
    exportedAt: new Date().toISOString(),
    channelId: channelId,
    totalVideos: videos.length,
    totalComments: 0,
    videosWithDisabledComments: [],
    videos: {}
  };

  // Fetch comments for each video
  console.log('💬 Fetching comments for each video...\n');
  let processedCount = 0;

  for (const video of videos) {
    processedCount++;
    const progress = `[${processedCount}/${videos.length}]`;

    console.log(`${progress} ${video.title}`);

    try {
      const { comments, disabled } = await fetchCommentsForVideo(youtube, video.id);

      if (disabled) {
        console.log('   ⚠ Comments disabled\n');
        output.videosWithDisabledComments.push(video.id);
      } else {
        const replyCount = comments.reduce((sum, c) => sum + c.replies.length, 0);
        console.log(`   ✓ ${comments.length} comments, ${replyCount} replies\n`);

        output.videos[video.id] = {
          title: video.title,
          publishedAt: video.publishedAt,
          commentCount: comments.length,
          comments: comments
        };

        output.totalComments += comments.length + replyCount;
      }

      await delay(CONFIG.delayMs);

    } catch (error) {
      if (error.code === 403 && error.message?.includes('quota')) {
        console.error('\n❌ YouTube API quota exceeded. Saving progress...');
        break;
      }
      console.error(`   ✗ Error: ${error.message}\n`);
    }
  }

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write output
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

  // Summary
  console.log('─'.repeat(50));
  console.log(`✅ Export complete!`);
  console.log(`   Total videos processed: ${Object.keys(output.videos).length}`);
  console.log(`   Total comments: ${output.totalComments}`);
  console.log(`   Videos with disabled comments: ${output.videosWithDisabledComments.length}`);
  console.log(`\n📁 Output saved to: ${OUTPUT_PATH}`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
