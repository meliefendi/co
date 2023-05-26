import { useMemo } from "react";

import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchAllProducts, deleteProduct } from "../../../api";
import { Button, Flex, Text } from "@chakra-ui/react";
import { Popconfirm, Table, message } from "antd";
import { Link } from "react-router-dom";

function AdminProducts() {
	const { isLoading, isError, data, error } = useQuery(["admin:products"], () =>
		fetchAllProducts()
	);
	const queryClient = useQueryClient();

	const deleteMutation = useMutation(deleteProduct, {
		onSuccess: () => queryClient.invalidateQueries("admin:products"),
	});

	const columns = useMemo(() => {
		return [
			{ title: "Title", dataIndex: "title", key: "title" },
			{ title: "Price", dataIndex: "price", key: "price" },
			{ title: "Created At", dataIndex: "createdAt", key: "createdAt" },
			{
				title: "Action",
				key: "action",
				render: (text, record) => (
					<>
						<Link to={`/admin/products/${record._id}`}>Edit</Link>

						<Popconfirm
							title={"Are you sure?"}
							onConfirm={() => {
								deleteMutation.mutate(record._id, {
									onSuccess: () => {
										message.success({ content: "silme başarılı", key: "product_update", duration: 2,  });
									},
								});
							}}
							onCancel={() => console.log("cancelled")}
							okText={"Yes"}
							cancelText={"No"}
							placement={"left"}
						>
							<a href="#" style={{ marginLeft: 10 }}>
								Delete
							</a>
						</Popconfirm>
					</>
				),
			},
		];
	}, []);
	if (isLoading) {
		return <div>Loading..</div>;
	}
	if (isError) {
		return <div>Error: {error.message}</div>;
	}

	// console.log(data);

	const dataSource = data;
	return (

		//ürün ekleme butonu
		<div>
			<Flex justifyContent={"space-between"} alignItems={"center"}>
				<Text fontSize={"2xl"}>Products</Text>
				<Link to={"/admin/products/new"}>
					<Button colorScheme="pink" >New Product</Button>
				</Link>
			</Flex>
			<Table dataSource={dataSource} columns={columns} rowKey={"_id"}></Table>
		</div>
	);
}

export default AdminProducts;