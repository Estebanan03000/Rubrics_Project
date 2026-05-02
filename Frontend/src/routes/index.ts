/* Archivo: Frontend\src\routes\index.ts
   Proposito: Implementa la logica principal del archivo index.
*/
import { lazy } from 'react';

const Calendar = lazy(() => import('../pages/Calendar'));
const Chart = lazy(() => import('../pages/Chart'));
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Tables = lazy(() => import('../pages/Tables'));
const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
const Buttons = lazy(() => import('../pages/UiElements/Buttons'));
const Demo= lazy(() => import('../pages/Demo'));
const UserCreate= lazy(() => import('../pages/Users/Create'));
const UserUpdate= lazy(() => import('../pages/Users/Update'));
const Posts= lazy(() => import('../pages/Posts/List'));

// Rubrics
const RubricsList = lazy(() => import('../pages/Rubrics/List'));
const RubricsCreate = lazy(() => import('../pages/Rubrics/Create'));
const RubricsUpdate = lazy(() => import('../pages/Rubrics/Update'));

// Students
const StudentsList = lazy(() => import('../pages/Students/List'));
const StudentsCreate = lazy(() => import('../pages/Students/Create'));
const StudentsUpdate = lazy(() => import('../pages/Students/Update'));

// Teachers
const TeachersList = lazy(() => import('../pages/Teachers/List'));
const TeachersCreate = lazy(() => import('../pages/Teachers/Create'));
const TeachersUpdate = lazy(() => import('../pages/Teachers/Update'));

// Subjects
const SubjectsList = lazy(() => import('../pages/Subjects/List'));
const SubjectsCreate = lazy(() => import('../pages/Subjects/Create'));
const SubjectsUpdate = lazy(() => import('../pages/Subjects/Update'));

// Groups
const GroupsList = lazy(() => import('../pages/Groups/List'));
const GroupsCreate = lazy(() => import('../pages/Groups/Create'));
const GroupsUpdate = lazy(() => import('../pages/Groups/Update'));

// Criteria
const CriteriaList = lazy(() => import('../pages/Criteria/List'));
const CriteriaCreate = lazy(() => import('../pages/Criteria/Create'));
const CriteriaUpdate = lazy(() => import('../pages/Criteria/Update'));

// Scales
const ScalesList = lazy(() => import('../pages/Scales/List'));
const ScalesCreate = lazy(() => import('../pages/Scales/Create'));
const ScalesUpdate = lazy(() => import('../pages/Scales/Update'));

// Grades
const GradesList = lazy(() => import('../pages/Grades/List'));
const GradesCreate = lazy(() => import('../pages/Grades/Create'));
const GradesUpdate = lazy(() => import('../pages/Grades/Update'));

// Enrollments
const EnrollmentsList = lazy(() => import('../pages/Enrollments/List'));
const EnrollmentsCreate = lazy(() => import('../pages/Enrollments/Create'));
const EnrollmentsUpdate = lazy(() => import('../pages/Enrollments/Update'));

// Evaluations
const EvaluationsList = lazy(() => import('../pages/Evaluations/List'));
const EvaluationsCreate = lazy(() => import('../pages/Evaluations/Create'));
const EvaluationsUpdate = lazy(() => import('../pages/Evaluations/Update'));

// Semesters
const SemestersList = lazy(() => import('../pages/Semesters/List'));
const SemestersCreate = lazy(() => import('../pages/Semesters/Create'));
const SemestersUpdate = lazy(() => import('../pages/Semesters/Update'));

// Careers
const CareersList = lazy(() => import('../pages/Careers/List'));
const CareersCreate = lazy(() => import('../pages/Careers/Create'));
const CareersUpdate = lazy(() => import('../pages/Careers/Update'));

// StudyPlans
const StudyPlansList = lazy(() => import('../pages/StudyPlans/List'));
const StudyPlansCreate = lazy(() => import('../pages/StudyPlans/Create'));
const StudyPlansUpdate = lazy(() => import('../pages/StudyPlans/Update'));


const coreRoutes = [
  {
    path: '/demo',
    title: 'Demo',
    component: Demo,
  },
  {
    path: '/users/create',
    title: 'Create User',
    component: UserCreate,
  },
  {
    path: '/users/update/:id',
    title: 'Edit User',
    component: UserUpdate,
  },

  {
      path: '/users/list',
      title: 'User List',
      component: lazy(() => import('../pages/Users/List')),
    },
    {
      path: '/roles/list',
      title: 'Role List',
      component: lazy(() => import('../pages/Roles/List')),
    },
    
  
  {
    path: '/posts/list',
    title: 'Posts',
    component: Posts,
  },
  {
    path: '/calendar',
    title: 'Calender',
    component: Calendar,
  },
  {
    path: '/profile',
    title: 'Profile',
    component: Profile,
  },
  {
    path: '/forms/form-elements',
    title: 'Forms Elements',
    component: FormElements,
  },
  {
    path: '/forms/form-layout',
    title: 'Form Layouts',
    component: FormLayout,
  },
  {
    path: '/tables',
    title: 'Tables',
    component: Tables,
  },
  {
    path: '/settings',
    title: 'Settings',
    component: Settings,
  },
  {
    path: '/chart',
    title: 'Chart',
    component: Chart,
  },
  {
    path: '/ui/alerts',
    title: 'Alerts',
    component: Alerts,
  },
  {
    path: '/ui/buttons',
    title: 'Buttons',
    component: Buttons,
  },

  // Rubrics
  { path: '/rubrics/list',       title: 'Rubrics List',    component: RubricsList },
  { path: '/rubrics/create',     title: 'Create Rubric',   component: RubricsCreate },
  { path: '/rubrics/update/:id', title: 'Edit Rubric',     component: RubricsUpdate },

  // Students
  { path: '/students/list',       title: 'Students List',   component: StudentsList },
  { path: '/students/create',     title: 'Create Student',  component: StudentsCreate },
  { path: '/students/update/:id', title: 'Edit Student',    component: StudentsUpdate },

  // Teachers
  { path: '/teachers/list',       title: 'Teachers List',   component: TeachersList },
  { path: '/teachers/create',     title: 'Create Teacher',  component: TeachersCreate },
  { path: '/teachers/update/:id', title: 'Edit Teacher',    component: TeachersUpdate },

  // Subjects
  { path: '/subjects/list',       title: 'Subjects List',   component: SubjectsList },
  { path: '/subjects/create',     title: 'Create Subject',  component: SubjectsCreate },
  { path: '/subjects/update/:id', title: 'Edit Subject',    component: SubjectsUpdate },

  // Groups
  { path: '/groups/list',       title: 'Groups List',   component: GroupsList },
  { path: '/groups/create',     title: 'Create Group',  component: GroupsCreate },
  { path: '/groups/update/:id', title: 'Edit Group',    component: GroupsUpdate },

  // Criteria
  { path: '/criteria/list',       title: 'Criteria List',   component: CriteriaList },
  { path: '/criteria/create',     title: 'Create Criterion',component: CriteriaCreate },
  { path: '/criteria/update/:id', title: 'Edit Criterion',  component: CriteriaUpdate },

  // Scales
  { path: '/scales/list',       title: 'Scales List',   component: ScalesList },
  { path: '/scales/create',     title: 'Create Scale',  component: ScalesCreate },
  { path: '/scales/update/:id', title: 'Edit Scale',    component: ScalesUpdate },

  // Grades
  { path: '/grades/list',       title: 'Grades List',   component: GradesList },
  { path: '/grades/create',     title: 'Create Grade',  component: GradesCreate },
  { path: '/grades/update/:id', title: 'Edit Grade',    component: GradesUpdate },

  // Enrollments
  { path: '/enrollments/list',       title: 'Enrollments List',   component: EnrollmentsList },
  { path: '/enrollments/create',     title: 'Create Enrollment',  component: EnrollmentsCreate },
  { path: '/enrollments/update/:id', title: 'Edit Enrollment',    component: EnrollmentsUpdate },

  // Evaluations
  { path: '/evaluations/list',       title: 'Evaluations List',   component: EvaluationsList },
  { path: '/evaluations/create',     title: 'Create Evaluation',  component: EvaluationsCreate },
  { path: '/evaluations/update/:id', title: 'Edit Evaluation',    component: EvaluationsUpdate },

  // Semesters
  { path: '/semesters/list',       title: 'Semesters List',   component: SemestersList },
  { path: '/semesters/create',     title: 'Create Semester',  component: SemestersCreate },
  { path: '/semesters/update/:id', title: 'Edit Semester',    component: SemestersUpdate },

  // Careers
  { path: '/careers/list',       title: 'Careers List',   component: CareersList },
  { path: '/careers/create',     title: 'Create Career',  component: CareersCreate },
  { path: '/careers/update/:id', title: 'Edit Career',    component: CareersUpdate },

  // StudyPlans
  { path: '/studyplans/list',       title: 'Study Plans List',   component: StudyPlansList },
  { path: '/studyplans/create',     title: 'Create Study Plan',  component: StudyPlansCreate },
  { path: '/studyplans/update/:id', title: 'Edit Study Plan',    component: StudyPlansUpdate },
];

const routes = [...coreRoutes];
export default routes;
