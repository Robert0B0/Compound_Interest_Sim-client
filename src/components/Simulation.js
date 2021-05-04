import React, { useState } from "react";
import { Input, Label, Segment, Button, Table, Popup } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_PLAN, FETCH_PLANS } from "../util/graphql";

let numeral = require("numeral");

function format(num, fix) {
	var p = num.toFixed(fix).split(".");
	return (
		p[0].split("").reduceRight(function (acc, num, i, orig) {
			if ("-" === num && 0 === i) {
				return num + acc;
			}
			var pos = orig.length - i - 1;
			return num + (pos && !(pos % 3) ? "," : "") + acc;
		}, "") + (p[1] ? "." + p[1] : "")
	);
}

export default function Simulation({ simPlan, setSimPlan }) {
	const [plans, setPlans] = useState([
		{ year: 0, amount: 0, profit: 0, cash: 0, contribution: 0 },
	]);

	const [createPlan] = useMutation(CREATE_PLAN, {
		refetchQueries: [{ query: FETCH_PLANS }],
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setSimPlan((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const simulate = (invest, years, rate, cash_rate, monthly) => {
		let plans = [
			{
				amount: invest,
				year: 0,
				profit: 0,
				cash: 0,
				contribution: 0,
			},
		];

		for (let i = 1; i <= years; i++) {
			let profit = (invest * rate) / 100;
			let cash = (profit * cash_rate) / 100;
			profit -= cash;
			invest = invest + profit + monthly * 12;
			plans.push({
				amount: invest,
				year: i,
				profit: profit,
				cash: cash,
				contribution: monthly,
			});
		}

		return plans;
	};

	const Simulate = () => {
		let plans = simulate(
			parseInt(simPlan.init_amount),
			parseInt(simPlan.years),
			parseInt(simPlan.rate),
			parseInt(simPlan.cash_rate),
			parseInt(simPlan.contribution)
		);
		setPlans(plans);
	};

	const Clear = () => {
		setSimPlan({
			init_amount: 0,
			rate: 0,
			years: 0,
			cash: 0,
			contribution: 0,
		});
	};

	return (
		<div>
			<Segment>
				<h3>Plan starting data:</h3>
				<Popup
					content="Set initial investment sum"
					trigger={
						<Input
							size="small"
							placeholder="initial amount"
							style={{ paddingRight: "15px" }}
						>
							<Label basic>$</Label>
							<input
								style={{ width: "120px" }}
								value={simPlan.init_amount}
								name="init_amount"
								onChange={handleChange}
							/>
						</Input>
					}
				/>
				<Popup
					content="Set the estimated interest rate"
					trigger={
						<Input
							size="small"
							placeholder="interest rate"
							style={{ paddingRight: "15px" }}
						>
							<Label basic>%</Label>
							<input
								style={{ width: "60px" }}
								value={simPlan.rate}
								name="rate"
								onChange={handleChange}
							/>
						</Input>
					}
				/>
				<Popup
					content="Set length of time in years"
					trigger={
						<Input
							size="small"
							placeholder="years length"
							style={{ paddingRight: "15px" }}
						>
							<Label basic>Y</Label>
							<input
								style={{ width: "60px" }}
								value={simPlan.years}
								name="years"
								onChange={handleChange}
							/>
						</Input>
					}
				/>
				<Popup
					content="Set the profit cash cut precentage"
					trigger={
						<Input
							size="small"
							placeholder="cash rate"
							style={{ paddingRight: "15px" }}
						>
							<Label basic>%</Label>
							<input
								style={{ width: "60px" }}
								value={simPlan.cash_rate}
								name="cash_rate"
								onChange={handleChange}
							/>
						</Input>
					}
				/>
				<Popup
					content="Set monthly contribtuion"
					trigger={
						<Input
							size="small"
							placeholder="monthly contribtuion"
							style={{ paddingRight: "20px" }}
						>
							<Label basic>$</Label>
							<input
								style={{ width: "90px" }}
								value={simPlan.contribution}
								name="contribution"
								onChange={handleChange}
							/>
						</Input>
					}
				/>
			</Segment>
			<Button basic color="green" onClick={Simulate}>
				Simulate
			</Button>
			<Button
				basic
				color="blue"
				onClick={() =>
					createPlan({
						variables: {
							initial_Investment: parseInt(simPlan.init_amount),
							interest_rate: parseInt(simPlan.rate),
							years_length: parseInt(simPlan.years),
							cash_rate: parseInt(simPlan.cash_rate),
							monthly_contribution: parseInt(simPlan.contribution),
						},
					})
				}
			>
				Save
			</Button>
			<Button basic color="red" onClick={Clear}>
				Clear
			</Button>

			<Segment>
				<h3>End Results:</h3>
				<Table celled striped color="green">
					<Table.Header>
						<Table.HeaderCell>Total Years</Table.HeaderCell>
						<Table.HeaderCell>End Amount</Table.HeaderCell>
						<Table.HeaderCell>Last Profit</Table.HeaderCell>
						{simPlan.cash_rate != 0 && (
							<Table.HeaderCell>Total Acumulated Cash</Table.HeaderCell>
						)}
					</Table.Header>
					<Table.Body>
						<Table.Row>
							<Table.Cell>{plans[0].year}</Table.Cell>
							<Table.Cell>
								<Label basic>$</Label>
								{format(plans[0].amount, 2)}
							</Table.Cell>
							<Table.Cell>
								<Label basic>$</Label>
								{format(plans[0].profit, 2)}
							</Table.Cell>
							{simPlan.cash_rate != 0 && (
								<Table.Cell>
									<Label basic>$</Label>
									{format(plans[0].cash, 2)}
								</Table.Cell>
							)}
						</Table.Row>
						<Table.Row>
							<Table.Cell>{plans[plans.length - 1].year}</Table.Cell>
							<Table.Cell>
								<Label basic>$</Label>
								{format(plans[plans.length - 1].amount, 2)}
							</Table.Cell>
							<Table.Cell>
								<Label basic>$</Label>
								{format(plans[plans.length - 1].profit, 2)}
							</Table.Cell>
							{simPlan.cash_rate != 0 && (
								<Table.Cell>
									<Label basic>$</Label>
									{format(
										plans.reduce(function (prev, curr) {
											return prev + curr.cash;
										}, 0),
										2
									)}
								</Table.Cell>
							)}
						</Table.Row>
					</Table.Body>
				</Table>
			</Segment>

			<Segment className="table_container">
				<h3>Simulated Years</h3>
				<Table celled striped color="yellow">
					<Table.Header>
						<Table.HeaderCell>Year</Table.HeaderCell>
						<Table.HeaderCell>Amount</Table.HeaderCell>
						<Table.HeaderCell>Profit</Table.HeaderCell>
						{simPlan.cash_rate != 0 && (
							<Table.HeaderCell>Cash</Table.HeaderCell>
						)}
					</Table.Header>
					{
						<Table.Body>
							{plans.map((plan) => {
								return (
									<Table.Row>
										<Popup
											content={"year " + plan.year}
											trigger={
												<Table.Cell>
													<Label basic>Year: </Label>
													{plan.year}
												</Table.Cell>
											}
										/>
										<Popup
											content={
												"Year " +
												plan.year +
												": $" +
												format(plan.amount - plan.profit, 2) +
												" + $" +
												format(plan.profit, 2) +
												(plan.contribution != 0
													? " + $" +
													  format(plan.contribution * 12, 2) +
													  " yearly contribution"
													: "")
											}
											trigger={
												<Table.Cell>
													{" "}
													<Label basic>$</Label>
													{numeral(plan.amount).format("0a.00")}
												</Table.Cell>
											}
										/>
										<Popup
											content={
												"Year " +
												plan.year +
												" Profit: $" +
												format(plan.profit + plan.cash, 2) +
												" from which: $" +
												format(plan.profit, 2) +
												" (reinvested)" +
												(plan.cash != 0
													? " - $" + format(plan.cash, 2) + " cash out sum"
													: "")
											}
											trigger={
												<Table.Cell>
													<Label basic>$</Label>
													{numeral(plan.profit).format("0a.0")}
												</Table.Cell>
											}
										/>
										{plan.cash !== 0 && (
											<Popup
												content={
													"Year " +
													plan.year +
													" cash out amount: $" +
													format(plan.cash, 2) +
													" (or $" +
													format(plan.cash / 12, 2) +
													" monthly income)"
												}
												trigger={
													<Table.Cell>
														{" "}
														<Label basic>$</Label>
														{numeral(plan.cash).format("0a.0")}
													</Table.Cell>
												}
											/>
										)}
									</Table.Row>
								);
							})}
						</Table.Body>
					}
				</Table>
			</Segment>
		</div>
	);
}
