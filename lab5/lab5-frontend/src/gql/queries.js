import { gql } from "@apollo/client";

export const unsplashImages = gql`
  query unsplashImages($pageNum: Int) {
    unsplashImages(pageNum: $pageNum) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

export const binnedImages = gql`
  query binnedImages {
    binnedImages {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

export const userPostedImages = gql`
  query userPostedImages {
    userPostedImages {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;
