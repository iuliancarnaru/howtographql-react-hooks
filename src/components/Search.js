import React, { useState } from "react";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
import Link from "./Link";

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

const Search = ({ client }) => {
  const initialState = {
    links: [],
    filter: "",
  };

  const [searchData, setSearchData] = useState(initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSearchData({ ...searchData, [name]: value });
  };

  const _executeSearch = async () => {
    const { filter } = searchData;
    const result = await client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter },
    });
    const links = result.data.feed.links;
    setSearchData({ links });
  };

  return (
    <div>
      <div>
        Search
        <input name="filter" type="text" onChange={handleChange} />
        <button onClick={() => _executeSearch()}>OK</button>
      </div>
      {searchData.links.map((link, index) => (
        <Link key={link.id} link={link} index={index} />
      ))}
    </div>
  );
};

export default withApollo(Search);
