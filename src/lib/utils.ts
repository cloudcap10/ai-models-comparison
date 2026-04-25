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
  };
  return colors[provider] ?? '#888888';
}

export function getTierLabel(tier: string): string {
  const labels: Record<string, string> = {
    frontier: 'Frontier',
    standard: 'Standard',
    lite: 'Lite',
  };
  return labels[tier] ?? tier;
}
