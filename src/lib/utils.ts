export function formatContextWindow(tokens: number): string {
  if (tokens >= 1_000_000) return `${tokens / 1_000_000}M`;
  if (tokens >= 1_000) return `${tokens / 1_000}K`;
  return String(tokens);
}

export function formatPrice(price: number): string {
  if (price === 0) return 'Free';
  if (price < 1) return `$${price.toFixed(2)}`;
  return `$${price.toFixed(2)}`;
}

export function getProviderColor(provider: string): string {
  const colors: Record<string, string> = {
    Anthropic: '#D97757',
    OpenAI: '#10A37F',
    Google: '#4285F4',
    Meta: '#0866FF',
    'Mistral AI': '#F7461C',
    DeepSeek: '#536DFE',
    xAI: '#AAAAAA',
    Alibaba: '#FF6A00',
    'Z.ai': '#00C6A2',
    Xiaomi: '#FF6900',
    MiniMax: '#7B61FF',
  };
  return colors[provider] ?? '#888888';
}

export function formatConsumerPlan(
  name: string | null,
  price: number | null
): { label: string; badge: string } | null {
  if (name === null || price === null) return null;
  const badge = price === 0 ? 'Free' : `$${price % 1 === 0 ? price : price.toFixed(2)}/mo`;
  return { label: name, badge };
}

/** Returns true when the model's releaseDate (YYYY-MM) is within the last 60 days. */
export function isNewModel(releaseDate: string): boolean {
  const [year, month] = releaseDate.split('-').map(Number);
  if (!year || !month) return false;
  const released = new Date(year, month - 1, 1);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 60);
  return released >= cutoff;
}

export function getTierLabel(tier: string): string {
  const labels: Record<string, string> = {
    frontier: 'Frontier',
    standard: 'Standard',
    lite: 'Lite',
  };
  return labels[tier] ?? tier;
}
