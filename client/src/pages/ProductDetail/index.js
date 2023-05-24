
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom';
import { fetchProduct } from '../../api';
import { Button, Text, Box, Flex } from '@chakra-ui/react';
import moment from "moment";
import ImageGallery from 'react-image-gallery';

import { useBasket } from '../../context/BasketContext';

function ProductDetail() {
    const { product_id } = useParams();
    const { addToBasket, items } = useBasket();

    const { isLoading, isError, data } = useQuery(["product", product_id], () =>
        fetchProduct(product_id));

    if (isLoading) {
        return <div> 'Loading...' </div>
    }

    if (isError) {
        return <div> error.message </div>
    }

    // basket içerisinde tekrar ürün karşılaştırması.
    const findBasketItem = items.find((item) => item._id === product_id);
    //imageGallery foto calipso 
    const images = data.photos.map((url) => ({ original: url }));
    return (
        <div>
            <Flex justify="center" >  <Text as="h2" fontSize="2xl" > {data.title} </Text> </Flex>


            <Text fontSize="12px" > {moment(data.createAt).format("DD/MM/YYYY")} </Text>
            <hr />
            <Text > {data.description} </Text>

            <Flex justify="center"> <Button colorScheme={findBasketItem ? "pink" : "yellow"} onClick={() => addToBasket(data, findBasketItem)} >
                {
                    //ürün olması veya olmaması durumunda seçilim
                    findBasketItem ? "Remove from basket" : " Add to basket"
                }
            </Button> </Flex>

            <Box margin="10">
                <ImageGallery items={images} />
            </Box>


        </div>
    )
}

export default ProductDetail;