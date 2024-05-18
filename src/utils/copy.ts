export default (text: string, event: Event) => {
  if (event) event.stopPropagation();
  try {
    navigator.clipboard.writeText(text);
  } catch (e) {
    const input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
};
