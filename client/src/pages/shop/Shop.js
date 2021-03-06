import React from 'react';
import { getProducts, getProductsByPriceFilter } from '../../firebase/firebaseUtils';

import './Shop.css';

import Fade from 'react-reveal/Fade';
import Pagination from 'react-js-pagination';

import Spinner from '../../components/Spinner/Spinner';
import PriceFilter from '../../components/PriceFilter/PriceFilter';
import NoDataImg from '../../assets/images/error/no-data.png';

class Shop extends React.Component {
	constructor(props) {
		super(props);

		this._isMounted = false;
	}

	state = {
		loading: true,
		min: '',
		max: '',
		products: null,
		currentPage: 1,
		itemsPerPage: 8,
		totalItemsCount: 0,
		activePage: 1
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		// For pagination
		const isDifferentPage = this.state.currentPage !== prevState.currentPage;
		if (isDifferentPage) this._isMounted && this.fetchData();

		// Checking if url params are different
		if (
			prevProps.match.params.category !== this.props.match.params.category ||
			prevProps.match.params.subCategory !== this.props.match.params.subCategory
		) {
			this._isMounted && this.fetchData();
		}
	}
	componentDidMount() {
		this._isMounted = true;
		this._isMounted && this.fetchData();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	handlePageChange = (pageNumber) => {
		this.setState({ currentPage: pageNumber });
	};

	handleFilterChange = async () => {
		this.fetchData();
	};

	fetchData = async () => {
		let data;
		const { currentPage, itemsPerPage, min, max } = this.state;
		const { category, subCategory } = this.props.match.params;
		const startAt = currentPage * itemsPerPage - itemsPerPage;

		if (category) {
			data = await getProducts(category, subCategory, startAt, itemsPerPage, min, max);
		} else {
			data = await getProducts('boxing', startAt, itemsPerPage);
		}

		this._isMounted &&
			this.setState({ loading: false, products: data, totalItemsCount: data ? data.totalItemsCount : 0 });
	};

	selectProductHandler = (product, category) => {
		this.props.history.push({
			pathname: `/shop/${category}/${product.id}`
		});
	};

	render() {
		let content = null;

		if (this.state.products) {
			content = this.state.products.items.map((item, i) => {
				if (i % 2) {
					return (
						<div className="box-container" key={item.id}>
							<Fade right>
								<div className="row">
									<div className="col-12 col-md-7 mr-auto " style={{ zIndex: '10' }}>
										<h1 className="text-left product-title">{item.name}</h1>
										<p>{item.description.substring(0, 200)}...</p>
										<h4>
											<strong>${item.price}</strong>
										</h4>
										<button
											className="btn btn-danger border mt-3"
											onClick={() =>
												this.selectProductHandler(item, this.state.products.routeName)}
										>
											View
										</button>
									</div>
									<div className="col-12 col-md-5">
										<div
											id="box-wrapper"
											onClick={() => this.selectProductHandler(item, this.state.products.title)}
										>
											<img
												src={item.imageUrl}
												style={{
													cursor: 'pointer',
													width: '100%',
													height: '100%'
												}}
												alt={item.name}
											/>
										</div>
									</div>
								</div>
							</Fade>
						</div>
					);
				} else {
					return (
						<div className="circle-container" key={item.id}>
							<Fade left>
								<div className="row ">
									<div className="col-12 col-md-7">
										<div
											id="circle-wrapper"
											onClick={() =>
												this.selectProductHandler(item, this.state.products.routeName)}
										>
											<img
												src={item.imageUrl}
												style={{ cursor: 'pointer', width: '100%', height: '100%' }}
												alt={item.name}
											/>
										</div>
									</div>
									<div className="col-12 col-md-5 ">
										<h1 className="text-left product-title">{item.name}</h1>
										<p>{item.description.substring(0, 200)}...</p>
										<h4>
											<strong>${item.price}</strong>
										</h4>
										<button
											className="btn btn-danger mt-3"
											onClick={() =>
												this.selectProductHandler(item, this.state.products.routeName)}
										>
											View
										</button>
									</div>
								</div>
							</Fade>
						</div>
					);
				}
			});
		} else {
			content = (
				<div className="container row mx-auto">
					<div className="col-md-8 mx-auto ">
						<img src={NoDataImg} className="img-fluid " alt="No data" />
					</div>
				</div>
			);
		}

		return (
			<div className="container-fluid  p-0 no-gutters">
				<h1 className="text-center m-1 display-4 text-primary text-uppercase font-italic font-weight-bold">
					{this.state.products && this.state.products.title}
				</h1>
				<PriceFilter
					min={this.state.min}
					max={this.state.max}
					handleMin={(e) => this.setState({ min: e.target.value })}
					handleMax={(e) => this.setState({ max: e.target.value })}
					handleFilter={this.handleFilterChange}
				/>
				{this.state.loading ? (
					<div className="row">
						<Spinner width="100px" height="100px" />
					</div>
				) : (
					<div className="items-container container-fluid mb-5">{content}</div>
				)}

				{this.state.totalItemsCount > 8 ? (
					<Pagination
						innerClass="pagination justify-content-center"
						itemClass="page-item"
						linkClass="page-link"
						activePage={this.state.currentPage}
						itemsCountPerPage={this.state.itemsPerPage}
						totalItemsCount={this.state.totalItemsCount || 0}
						pageRangeDisplayed={5}
						onChange={this.handlePageChange}
					/>
				) : null}
			</div>
		);
	}
}

export default Shop;
