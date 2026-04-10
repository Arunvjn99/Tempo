let msgCounter = 0;

export function nextMessageId() {
  return `msg-${++msgCounter}-${Date.now()}`;
}
