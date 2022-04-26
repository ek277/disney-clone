import { gql, GraphQLClient } from "graphql-request";
import NavBar from "../components/Navbar";
import Section from "../components/Section";

export const getStaticProps = async () => {
  const url = process.env.ENDPOINT;
  const token = process.env.GRAPH_CMS_TOKEN;

  const graphQLClient = new GraphQLClient(url, {
    headers: {
      Authorization: token,
    },
  });

  const videosQuery = gql`
    query {
      videos {
        createdAt
        id
        title
        description
        seen
        slug
        tags
        thumbnail {
          url
        }
        mp4 {
          url
        }
      }
    }
  `;

  const accountQuery = gql`
    query {
      account(where: { id: "cl1pxglbecvtg0biof4h95egs" }) {
        username
        avatar {
          url
        }
      }
    }
  `;

  const data = await graphQLClient.request(videosQuery);
  const videos = data.videos;

  const accountData = await graphQLClient.request(accountQuery);
  const account = accountData.account;

  return {
    props: {
      videos,
      account,
    },
  };
};

const Home = ({ videos, account }) => {
  console.log(videos);
  const randomVideo = (videos) => {
    return videos[Math.floor(Math.random() * videos.length)];
  };

  const filterVideos = (videos, genre) => {
    return videos.filter((video) => video.tags.includes(genre));
  };

  const unSeenVideos = (videos) => {
    return videos.filter((video) => video.seen == false || video.seen == null);
  };

  return (
    <>
      <NavBar account={account} />
      <div className="app">
        <div className="main-video">
          <img
            src={randomVideo(videos).thumbnail.url}
            alt={randomVideo(videos).title}
          />
        </div>

        <div className="video-feed">
          <Section genre={"Recomended for you"} videos={unSeenVideos(videos)} />

          <Section genre={"Family"} videos={filterVideos(videos, "family")} />
          <Section
            genre={"Thriller"}
            videos={filterVideos(videos, "thriller")}
          />
          <Section genre={"Classic"} videos={filterVideos(videos, "classic")} />
          <Section genre={"Pixar"} videos={filterVideos(videos, "pixar")} />
          <Section genre={"Marvel"} videos={filterVideos(videos, "marvel")} />
          <Section
            genre={"National Geographic"}
            videos={filterVideos(videos, "national-geographic")}
          />
          <Section genre={"Disney"} videos={filterVideos(videos, "disney")} />
          <Section
            genre={"Star Wars"}
            videos={filterVideos(videos, "star-wars")}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
