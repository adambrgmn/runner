'use client';

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { toKm, toMinPerKm } from '@/lib/utils';

interface YearStats {
  title: string;
  average_speed: number;
  average_distance: number;
  total_distance: number;
  total_runs: number;
}

interface StatisticsTableProps {
  data: YearStats[];
}

export function StatisticsTable({ data }: StatisticsTableProps) {
  const column = createColumnHelper<(typeof data)[number]>();
  const columns = [
    column.accessor('title', {
      header: '',
      cell: (props) => <span className="text-stone-700">{props.getValue()}</span>,
    }),
    column.accessor('average_speed', {
      header: 'avg. pace',
      cell: (props) => <span>{toMinPerKm(props.getValue(), true)}</span>,
    }),
    column.accessor('average_distance', {
      header: 'avg. distance',
      cell: (props) => <span>{toKm(props.getValue(), true)}</span>,
    }),
    column.accessor('total_distance', {
      header: 'tot. dist.',
      cell: (props) => <span>{toKm(props.getValue(), true)}</span>,
    }),
    column.accessor('total_runs', {
      header: 'tot. runs',
      cell: (props) => <span>{props.getValue()}</span>,
    }),
  ];

  const table = useReactTable({ data: data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="relative w-auto table-auto border-collapse overflow-x-scroll pb-4 text-sm">
      <h3 className="sticky left-0 mb-4 text-base font-medium text-stone-700">Statistics</h3>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="whitespace-nowrap px-2 py-1 text-right font-normal text-stone-700">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <td
                    key={cell.id}
                    className="whitespace-nowrap border-r px-2 py-1 text-right tabular-nums text-stone-400 last:border-r-0"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
