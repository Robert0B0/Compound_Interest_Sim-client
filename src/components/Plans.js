import React, { useContext } from "react";
import { AuthContext } from "../util/auth";
import { Grid, Segment, Popup, Button } from "semantic-ui-react";
import { DELETE_PLAN, FETCH_PLANS } from "../util/graphql";
import { useMutation } from "@apollo/react-hooks";

let numeral = require("numeral");

export default function Plans({ plans, loading, setSimPlan }) {
	const handleClick = (plan) => {
		setSimPlan({
			init_amount: plan.initial_Investment,
			years: plan.years_length,
			rate: plan.interest_rate,
			cash_rate: plan.cash_rate,
			contribution: plan.monthly_contribution,
		});
	};

	const { user } = useContext(AuthContext);

	const [deletePlan] = useMutation(DELETE_PLAN, {
		refetchQueries: [{ query: FETCH_PLANS }],
	});

	return (
		<div>
			{loading
				? "loading..."
				: plans.map((plan) => {
						return (
							<Grid stackable>
								<Grid.Column width={10}>
									<Popup
										content="add this plan to simulation"
										position="right center"
										size="large"
										trigger={
											<Segment color="yellow" onClick={() => handleClick(plan)}>
												<div key={plan.id}>
													<h4>
														{numeral(plan.initial_Investment).format("0.0a")}
													</h4>
													<h4>%{plan.interest_rate}</h4>
													<h4>{plan.years_length} years</h4>
												</div>
											</Segment>
										}
									/>
									{user && user.username === plan.username && (
										<Button
											basic
											color="red"
											onClick={() =>
												deletePlan({ variables: { planId: plan.id } })
											}
										>
											Delete
										</Button>
									)}
								</Grid.Column>
							</Grid>
						);
				  })}
		</div>
	);
}
