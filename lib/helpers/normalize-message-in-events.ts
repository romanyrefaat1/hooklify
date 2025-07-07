export default function normalizeMessageInEvents(messages: {value: string, style: string, color: string}[]) {
    return messages.map((segment) => segment.value).join('');
}