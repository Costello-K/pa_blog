import { FaBloggerB } from 'react-icons/fa';
import styled from 'styled-components';

const HomePageContainer = styled.div`
  text-align: center;
`;

const IconWrapper = styled.div`
  height: 100px;
  margin: 100px auto;
`;

const Icon = styled(FaBloggerB)`
  height: 100%;
  width: 100%;
`;

function HomePage() {
  return (
    <HomePageContainer>
      <IconWrapper><Icon /></IconWrapper>
      <h1>
        It's BLOG
      </h1>
    </HomePageContainer>
  )
};

export default HomePage;
