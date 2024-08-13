import React from 'react';
import { Icon } from '@iconify/react';
import { twMerge } from 'tailwind-merge';
// routes
import { paths } from '/src/routes/paths';
// interfaces
import { StudentInterface } from '/src/interfaces/student';
// components
import { Button } from '/src/components/button';
import { DialogConfirm } from '/src/components/dialog';

// ----------------------------------------------------------------------

interface StudentTableProps {
  students: StudentInterface[];
  onDeleteStudent: (id: string) => Promise<void>;
}

// ----------------------------------------------------------------------

const StudentTable: React.FC<StudentTableProps> = ({ students, onDeleteStudent }) => {
  const tableHead = [
    { title: 'No', className: 'min-w-[10%]' },
    { title: 'NIS', className: 'min-w-[20%]' },
    { title: 'Nama Lengkap', className: 'min-w-[40%]' },
    { title: 'Kelas', className: 'min-w-[10%]' },
    { title: 'Aksi', className: 'min-w-[20%]' },
  ];

  return (
    <div className="mt-2 overflow-x-auto">
      <table className="table-zebra table">
        <thead>
          <tr>
            {tableHead.map((th, i) => (
              <th key={i} className={twMerge('border border-primary-1 bg-primary-1 py-4 text-center text-base text-white', th.className)}>
                {th.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students?.map((student, i) => (
            <tr key={i}>
              <td className="border border-neutral-400 px-1 py-3 text-center">{i + 1}</td>

              <td className="border border-neutral-400 px-1 py-3">{student.nis}</td>

              <td className="border border-neutral-400 px-1 py-3">{student.name}</td>

              <td className="border border-neutral-400 px-1 py-3 text-center">{student.class}</td>

              <td className="border border-neutral-400 px-1 py-3">
                <div className="flex flex-row items-center justify-center gap-2">
                  <Button component="RouterLink" href={paths.dashboard.student.update(student.id)} variant="gost" data-tip="Perbarui" className="tooltip">
                    <Icon icon="mdi:pencil" width={24} className="text-neutral-500" />
                  </Button>

                  <DialogConfirm
                    label={
                      <span data-tip="Hapus" className="tooltip">
                        <Icon icon="mdi:trash" width={24} className="tooltip text-red-500" />
                      </span>
                    }
                    title={`Konfirmasi penghapusan "${student.name}"`}
                    action={() => onDeleteStudent(student.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
