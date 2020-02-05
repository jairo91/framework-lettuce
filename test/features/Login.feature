Feature: LOGIN

	@Login_001
	@service @login @gm
	Scenario Outline: Login_001 - User logins correctly in SalesForce
		Given User logins with user: "<userSalesForce>" in salesForce and access to "Case" page

		Examples:
			| userSalesForce |
			| standardGM     |
