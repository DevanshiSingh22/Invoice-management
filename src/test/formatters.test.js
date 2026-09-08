import { describe, expect, it } from 'vitest';
import { daysOverdue, formatCurrency } from '../lib/formatters';

describe('formatters', () => {
  it('formats INR currency without decimal noise', () => expect(formatCurrency(184500)).toContain('1,84,500'));
  it('never returns a negative overdue count', () => expect(daysOverdue('2099-01-01')).toBe(0));
});
