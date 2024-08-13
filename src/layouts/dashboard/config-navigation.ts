// routes
import { paths } from '/src/routes/paths';

// ----------------------------------------------------------------------

export interface ConfigNavigationInterface {
  title: string;
  path: string;
  icon: string;
  children?: ConfigNavigationInterface[];
}

// ----------------------------------------------------------------------

export const configNavigation: ConfigNavigationInterface[] = [
  {
    title: 'Dashboard',
    path: paths.dashboard.root,
    icon: 'mage:dashboard-fill',
  },
  {
    title: 'Forms',
    path: paths.dashboard.form.root,
    icon: 'mdi:form',
  },
  {
    title: 'Students',
    path: paths.dashboard.student.root,
    icon: 'ph:student-fill',
  },
];
