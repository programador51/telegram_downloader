export default function ClickMe(
  props: React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
) {
  return (
    <a {...props} href="https://allmylinks.com/programador51" target="_blank">
      <button className="btn btn-info btn-sm">Please click me</button>
    </a>
  );
}
