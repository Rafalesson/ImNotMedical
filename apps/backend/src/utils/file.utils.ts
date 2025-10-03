const MAX_FILE_NAME_LENGTH = 120;

function sanitizeSegment(segment: string | null | undefined): string {
  if (!segment) {
    return '';
  }

  return segment
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

export function buildDocumentFileBase(
  prefix: string,
  fullName?: string | null,
  uniqueSuffix?: string | number | null,
): string {
  const safePrefix = sanitizeSegment(prefix) || 'documento';

  const trimmedName = (fullName ?? '').trim();
  const parts = trimmedName ? trimmedName.split(/\s+/).filter(Boolean) : [];

  let firstName = parts[0];
  let lastName = parts.length > 1 ? parts[parts.length - 1] : firstName;

  if (!firstName) {
    firstName = 'paciente';
  }

  if (!lastName) {
    lastName = firstName;
  }

  const nameSegments = [firstName, lastName]
    .map((segment) => sanitizeSegment(segment))
    .filter((segment, index, array) => segment && array.indexOf(segment) === index);

  if (nameSegments.length === 0) {
    nameSegments.push('paciente');
  }

  const segments = [safePrefix, ...nameSegments];

  if (uniqueSuffix !== undefined && uniqueSuffix !== null) {
    const suffixSegment = sanitizeSegment(String(uniqueSuffix));
    if (suffixSegment) {
      segments.push(suffixSegment);
    }
  }

  const base = segments.join('_');
  if (base.length <= MAX_FILE_NAME_LENGTH) {
    return base;
  }

  return base.slice(0, MAX_FILE_NAME_LENGTH);
}
