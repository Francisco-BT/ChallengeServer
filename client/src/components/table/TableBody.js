export function TableBody({ items = [], renderFunction }) {
  return <tbody>{items.map((item) => renderFunction(item))}</tbody>;
}
