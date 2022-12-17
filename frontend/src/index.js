import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import './index.css';
import App from './App';
import StudentProfile from './Layouts/StudentProfile'
import InstructorProfile from './Layouts/InstructorProfile'
import 'bootstrap/dist/css/bootstrap.min.css';
import useToken from './useToken';
import EditProfile from './Layouts/EditProfile';
import Users from './Layouts/Users/Users';
import Students from './Layouts/Users/Students';
import Instructors from './Layouts/Users/Instructors';
import Articles from './Layouts/Articles';
import AddArticle from './Layouts/Articles/AddArticle';
import ShowArticle from './Layouts/Articles/ShowArticle';
import Topics from './Layouts/Topics';

import QuizQuestions from './Layouts/Quiz/QuizQuestions';
import EditeArticle from './Layouts/Articles/EditeArticle';
// >>>>>>> 5afeb22f6d8516c667223966abd75f6143df2532

const ProtectedRoute = ({ children }) => {
  const { token } = useToken();
  if (!token) return <Navigate to={'/'} replace />
  return children;
}

const AdminRoute = ({ children }) => {
  const { token, isAdmin } = useToken();
  if (!token || !isAdmin) return <Navigate to={'/'} replace />
  return children;
}
const InstructorRoute = ({ children }) => {
  const { token, isInstructor } = useToken();
  if (!token || !isInstructor) return <Navigate to={'/'} replace />
  return children;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>

        <Route path='/students/:id' element={<StudentProfile />} />
        <Route path='/instructors/:id' element={<InstructorProfile />} />

        <Route path='/users' element={<Users />} >
          <Route path='' element={<Students />} />
          <Route path='students' element={<Students />} />
          <Route path='instructors' element={<Instructors />} />
          <Route path='admins' element={<Students />} />
        </Route>



        <Route path='/Topics' element={
          <AdminRoute >
            <Topics />
          </AdminRoute>} />


        <Route path='/articles/:id' element={<ShowArticle />} />
        <Route path='/articles/add' element={
          <InstructorRoute>
            <AddArticle />
          </InstructorRoute>
        } />
        <Route path='/articles/edite/:id' element={
          <InstructorRoute>
            <EditeArticle />
          </InstructorRoute>
        } />
        <Route path='/articles' element={<Articles />} />


<Route path='/quizzes'element={
<ProtectedRoute>
<QuizQuestions/>
</ProtectedRoute>}/>






        <Route path='edit/me' element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        } />


      </Route>
    </Routes>
  </BrowserRouter >
); 