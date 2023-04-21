import { Routes, Route } from 'react-router-dom';
import styled from "styled-components";

import Header from "./layout/Header";
import UserList from "./layout/user/UserList";
import UserAccount from "./layout/user/UserAccount";
import RegistrationForm from "./layout/account/Registration";
import LoginForm from "./layout/account/Login";
import NotFoundPage from "./layout/NotFoundPage";
import MyAccount from "./layout/account/MyAccount";
import HomePage from "./layout/HomePage";
import EditPost from "./layout/post/EditPost";
import FollowerList from "./layout/follower/FollowerList";
import SubscriberList from "./layout/subscriber/SubscriberList";
import PostList from "./layout/post/PostList";
import TagPostList from "./layout/post/TagPostList";
import PostDetails from "./layout/post/PostDetails";
import ConfirmActivationAccount from "./layout/account/ConfirmActivationAccount";
import ConfirmDeleteAccount from "./layout/account/ConfirmDeleteAccount";
import ActivationAccount from "./layout/account/ActivationAccount";
import SettingsProfile from "./layout/account/SettingsProfile";
import ResetPasswordEnterEmail from "./layout/account/ResetPasswordEnterEmail";
import ResetPasswordConfirmEmailSending from "./layout/account/ResetPasswordConfirmEmailSending";
import ResetPasswordEnterNewPassword from "./layout/account/ResetPasswordEnterNewPassword";
import ResetPasswordSuccess from "./layout/account/ResetPasswordSuccess";

const MainContainer = styled.div`
  max-width: 800px;
  min-width: 480px;
  min-height: 101hv;
  margin: 20px auto;
  @media screen and (max-width: 768px) {
    width: calc(50% - 12px);
  }
`;

function App() {
  return (
    <div style={{ minHeight: 'calc(100vh + 1px)'}}>
      <Header />
      <MainContainer>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/posts' element={<PostList />} />
          <Route path='/followers' element={<FollowerList />} />
          <Route path='/subscribers' element={<SubscriberList />} />
          <Route path='/posts/edit/:id/:slug' element={<EditPost />} />
          <Route path='/posts/:id/:slug' element={<PostDetails />} />
          <Route path='/tags/:slug' element={<TagPostList />} />
          <Route path='/users' element={<UserList />} />
          <Route path='/users/:id/:slug' element={<UserAccount />} />
          <Route path='/users/me' element={<MyAccount />} />
          <Route path='/users/delete' element={<ConfirmDeleteAccount />} />
          <Route path='/users/registration' element={<RegistrationForm />} />
          <Route path='/users/activate' element={<ActivationAccount />} />
          <Route path='/users/settings' element={<SettingsProfile />} />
          <Route path='/auth/users/activate/:uid/:token' element={<ConfirmActivationAccount />} />
          <Route path='/users/login' element={<LoginForm />} />
          <Route path='/users/reset_password/email' element={<ResetPasswordEnterEmail />} />
          <Route path='/users/reset_password/email_sent' element={<ResetPasswordConfirmEmailSending />} />
          <Route path='/auth/users/password_reset_confirm/:uid/:token' element={<ResetPasswordEnterNewPassword />} />
          <Route path='/users/reset_password/reset_done' element={<ResetPasswordSuccess />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </MainContainer>
    </div>
  )
};

export default App;
