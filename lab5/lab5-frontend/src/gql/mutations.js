import { gql } from "@apollo/client";

export const uploadImage = gql`
  mutation uploadImage(
    $url: String!
    $description: String
    $posterName: String
  ) {
    uploadImage(url: $url, description: $description, posterName: $posterName) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

export const updateImage = gql`
  mutation updateImage(
    $updateImageId: ID!
    $url: String
    $posterName: String
    $description: String
    $userPosted: Boolean
    $binned: Boolean
  ) {
    updateImage(
      id: $updateImageId
      url: $url
      posterName: $posterName
      description: $description
      userPosted: $userPosted
      binned: $binned
    ) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

export const deleteImage = gql`
  mutation deleteImage($deleteImageId: ID!) {
    deleteImage(id: $deleteImageId) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;
