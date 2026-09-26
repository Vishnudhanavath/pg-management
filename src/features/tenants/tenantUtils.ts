export const normalizeBedLabel = (value?: string) => {
  const label = value?.trim().replace(/^bed[\s:]*/i, '').trim();
  return label ? `Bed ${label}` : '';
};
