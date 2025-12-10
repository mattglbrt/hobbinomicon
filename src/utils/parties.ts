/**
 * Party utility functions for display names and descriptions
 */

import partiesConfig from '../data/parties.json';

type PartyData = {
  display: string;
  description: string;
  campaign: string;
  status: 'active' | 'inactive' | 'retired';
};

type PartiesConfig = {
  parties: Record<string, PartyData>;
};

const config = partiesConfig as PartiesConfig;

/**
 * Get party display name
 * Uses config if available, otherwise converts to title case
 */
export function getPartyDisplay(party: string): string {
  return config.parties[party]?.display || toTitleCase(party);
}

/**
 * Get party description from config
 * Returns undefined if party not in config
 */
export function getPartyDescription(party: string): string | undefined {
  return config.parties[party]?.description;
}

/**
 * Get party campaign from config
 */
export function getPartyCampaign(party: string): string | undefined {
  return config.parties[party]?.campaign;
}

/**
 * Get party status from config
 */
export function getPartyStatus(party: string): string | undefined {
  return config.parties[party]?.status;
}

/**
 * Check if party exists in config
 */
export function isKnownParty(party: string): boolean {
  return party in config.parties;
}

/**
 * Get all parties from config
 */
export function getAllParties(): string[] {
  return Object.keys(config.parties);
}

/**
 * Get all parties for a specific campaign
 */
export function getPartiesByCampaign(campaign: string): string[] {
  return Object.entries(config.parties)
    .filter(([_, data]) => data.campaign === campaign)
    .map(([key]) => key);
}

/**
 * Get full party data
 */
export function getPartyData(party: string): PartyData | undefined {
  return config.parties[party];
}

/**
 * Convert kebab-case to Title Case
 */
function toTitleCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
