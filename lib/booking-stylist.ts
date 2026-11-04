/** Sentinel used when the client picks No preference on a team service. */
export const NO_PREFERENCE_ID = '__no_preference__';

type StylistService = {
  selectedProviderId?: string | null;
  providerTeamMembers?: Array<{ id: string; name: string }> | null;
};

/** Provider display name, "No preference", or null when the service has no team. */
export function resolveProfessionalName(service: StylistService): string | null {
  const members = service.providerTeamMembers || [];
  if (members.length === 0) return null;

  const id = service.selectedProviderId;
  if (!id || id === NO_PREFERENCE_ID) return 'No preference';

  return members.find((m) => m.id === id)?.name?.trim() || 'No preference';
}

/** Footer / summary label: "With {name}", "No preference", or null. */
export function resolveStylistLabel(service: StylistService): string | null {
  const name = resolveProfessionalName(service);
  if (!name) return null;
  if (name === 'No preference') return 'No preference';
  return `With ${name}`;
}
