const Table = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`w-full overflow-auto ${className}`}>
    <table className="w-full caption-bottom text-sm">{children}</table>
  </div>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="[&_tr]:border-b">{children}</thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="[&_tr:last-child]:border-0">{children}</tbody>
);

const TableRow = ({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <tr
    className={`border-b transition-colors data-[state=selected]:bg-muted ${className}`}
    onClick={onClick}
  >
    {children}
  </tr>
);

const TableHead = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <th
    className={`h-12 px-2 sm:px-4 text-left text-[12px] align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
  >
    {children}
  </th>
);

const TableCell = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <td className={`p-2 sm:p-4 align-middle text-[13px] [&:has([role=checkbox])]:pr-0 ${className}`}>
    {children}
  </td>
);

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
