export function formatResponse(data: any): string {
  if (typeof data === 'string') {
    try {
      // Try to parse as JSON if it's a string that looks like JSON
      const parsed = JSON.parse(data);
      return formatJsonSyntax(JSON.stringify(parsed, null, 2));
    } catch {
      // If it's not parseable as JSON, return as is
      return data;
    }
  }
  
  // If it's already an object, stringify it with indentation
  return formatJsonSyntax(JSON.stringify(data, null, 2));
}

function formatJsonSyntax(jsonString: string): string {
  // Add syntax highlighting classes
  return jsonString
    .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
    .replace(/"([^"]+)"(?=[,\n]|\s*\}|\s*\])/g, '<span class="json-string">"$1"</span>')
    .replace(/\b(true|false)\b/g, '<span class="json-boolean">$1</span>')
    .replace(/\b(null)\b/g, '<span class="json-null">$1</span>')
    .replace(/\b(\d+([.]\d+)?)\b/g, '<span class="json-number">$1</span>');
}
