import { gql, GraphQLClient } from "graphql-request";

export const getStaticProps = async () => {
  const url = process.env.ENDPOINT;
  const token = process.env.GRAPH_CMS_TOKEN;

  const graphQLClient = new GraphQLClient(url, {
    headers: {
      Authorization: token,
    },
  });

  const query = gql`
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

  const data = await graphQLClient.request(query);

  const videos = data.videos;

  return {
    props: {
      videos,
    },
  };
};

const Home = ({ videos }) => {
  // console.log(videos);
  const randomVideo = (videos) => {
    return videos[Math.floor(Math.random() * videos.length)];
  };

  return (
    <>
      <div className="app">
        <div className="main-video">
          <img
            src={randomVideo(videos).thumbnail.url}
            alt={randomVideo(videos).title}
          />
        </div>
      </div>
      <div className="video-fit">feed</div>
    </>
  );
};

export default Home;
