import React from 'react';
import { Icon } from '@iconify/react';
// routes
import { paths } from '/src/routes/paths';
// layouts
import { RoleBasedGuard } from '/src/layouts/guard';
// components
import { Button } from '/src/components/button';
//
import CreateForm from '../create/create-form';

// ----------------------------------------------------------------------

const StudentCreateView: React.FC = () => {
  return (
    <RoleBasedGuard>
      <section>
        <div>
          <Button component="RouterLink" href={paths.dashboard.student.root} variant="gost" className="flex flex-row items-center gap-1">
            <Icon icon="ic:round-arrow-back-ios" color="#000" />

            <span className="text-lg font-semibold text-black">Add Student</span>
          </Button>
        </div>

        <div className="mt-5">
          <CreateForm />
        </div>
      </section>
    </RoleBasedGuard>
  );
};

export default StudentCreateView;
