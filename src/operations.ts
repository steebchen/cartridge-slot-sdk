import { gql } from 'graphql-tag';

export const CREATE_DEPLOYMENT = gql`
  mutation CreateDeployment(
    $project: String!
    $service: CreateServiceInput!
    $tier: DeploymentTier!
    $wait: Boolean
    $regions: [String!]
    $team: String
  ) {
    createDeployment(
      name: $project
      service: $service
      tier: $tier
      wait: $wait
      regions: $regions
      team: $team
    ) {
      __typename
      id
      version
      config {
        configFile
      }
    }
  }
`;

export const UPDATE_DEPLOYMENT = gql`
  mutation UpdateDeployment(
    $project: String!
    $service: UpdateServiceInput!
    $tier: DeploymentTier
    $wait: Boolean
  ) {
    updateDeployment(
      name: $project
      service: $service
      tier: $tier
      wait: $wait
    ) {
      __typename
      id
      version
      config {
        configFile
      }
    }
  }
`;
