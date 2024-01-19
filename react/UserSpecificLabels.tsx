import React, { useEffect } from 'react'

import { useQuery } from 'react-apollo'
import useProduct from 'vtex.product-context/useProduct'
import productDetails from './graphql/productDetails.graphql'
import { useLazyFullSession } from 'vtex.session-client'

interface UserSpecificLabelsProps {}

const UserSpecificLabels: StorefrontFunctionComponent<UserSpecificLabelsProps> = ({}) => {
	const [getSession, session] = useLazyFullSession()

	useEffect(() => {
		getSession()
	}, [])

	console.log({ session })

	const firstName =
		session?.data?.session?.namespaces?.profile?.firstName?.value || 'guest'
	const lastName =
		session?.data?.session?.namespaces?.profile?.lastName?.value || 'user'

	const { product } = useProduct()

	if (!product) {
		return (
			<div>
				<span>There is no product context.</span>
			</div>
		)
	}

	const { data, loading, error } = useQuery(productDetails, {
		variables: {
			slug: product?.linkText,
		},
		ssr: false,
	})

	if (loading) {
		return (
			<div>
				<span>Loading details...</span>
			</div>
		)
	}
	if (error) {
		return (
			<div>
				<span>Error!</span>
			</div>
		)
	}

	console.log('data:', data)

	return (
		<div>
			<h2>Hi {firstName + ' ' + lastName}! </h2>
			<h3>This product was released in : {data.product.releaseDate}</h3>{' '}
			<h3> By {data.product.brand}</h3>
		</div>
	)
}

UserSpecificLabels.schema = {
	title: 'editor.user-specific-labels.title',
	description: 'editor.user-specific-labels.description',
	type: 'object',
	properties: {},
}

export default UserSpecificLabels
