import gql from "graphql-tag";

export const FETCH_PLANS = gql`
	{
		getPlans {
			id
			username
			createdAt
			initial_Investment
			years_length
			interest_rate
			cash_rate
			monthly_contribution
		}
	}
`;

export const FETCH_PLAN = gql`
	query getPlan($planId: ID!) {
		getPlan(planId: $planId) {
			id
			username
			createdAt
			initial_Investment
			years_length
			interest_rate
			cash_rate
			monthly_contribution
		}
	}
`;

export const CREATE_PLAN = gql`
	mutation createPlan(
		$initial_Investment: Int!
		$interest_rate: Int!
		$years_length: Int!
		$cash_rate: Int
		$monthly_contribution: Int
	) {
		createPlan(
			initial_Investment: $initial_Investment
			interest_rate: $interest_rate
			years_length: $years_length
			cash_rate: $cash_rate
			monthly_contribution: $monthly_contribution
		) {
			initial_Investment
			interest_rate
			years_length
			cash_rate
			monthly_contribution
		}
	}
`;

export const DELETE_PLAN = gql`
	mutation deletePlan($planId: ID!) {
		deletePlan(planId: $planId)
	}
`;
