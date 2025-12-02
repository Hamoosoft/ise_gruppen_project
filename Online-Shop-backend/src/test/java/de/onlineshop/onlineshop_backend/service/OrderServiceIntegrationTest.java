package de.onlineshop.onlineshop_backend.service;

import de.onlineshop.onlineshop_backend.dto.CreateOrderRequest;
import de.onlineshop.onlineshop_backend.dto.OrderResponse;
import de.onlineshop.onlineshop_backend.model.Product;
import de.onlineshop.onlineshop_backend.repository.OrderRepository;
import de.onlineshop.onlineshop_backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class OrderServiceIntegrationTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        // Nimm ein existierendes Produkt (vom DataInitializer)
        sampleProduct = productRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new IllegalStateException("Kein Produkt in der Datenbank gefunden."));
    }

    @Test
    void createOrder_persistsOrderAndCalculatesTotal() {
        // arrange
        CreateOrderRequest.OrderItemRequest item = new CreateOrderRequest.OrderItemRequest();
        item.setProductId(sampleProduct.getId());
        item.setQuantity(2);

        CreateOrderRequest request = new CreateOrderRequest();
        request.setCustomerName("Test Kunde");
        request.setCustomerEmail("test@example.com");
        request.setItems(Collections.singletonList(item));

        // act
        OrderResponse response = orderService.createOrder(request);

        // assert
        assertThat(response).isNotNull();
        assertThat(response.getId()).isNotNull();
        assertThat(response.getCustomerEmail()).isEqualTo("test@example.com");
        assertThat(response.getItems()).hasSize(1);

        BigDecimal expectedTotal = sampleProduct.getPrice().multiply(BigDecimal.valueOf(2));
        assertThat(response.getTotalAmount()).isEqualByComparingTo(expectedTotal);

        // und es ist auch wirklich in der DB
        assertThat(orderRepository.findById(response.getId())).isPresent();
    }

    @Test
    void getOrdersByEmail_returnsOrdersForCustomer() {
        // arrange – zuerst eine Bestellung anlegen
        CreateOrderRequest.OrderItemRequest item = new CreateOrderRequest.OrderItemRequest();
        item.setProductId(sampleProduct.getId());
        item.setQuantity(1);

        CreateOrderRequest request = new CreateOrderRequest();
        request.setCustomerName("Test Kunde 2");
        request.setCustomerEmail("kunde2@example.com");
        request.setItems(Collections.singletonList(item));

        orderService.createOrder(request);

        // act
        List<OrderResponse> orders = orderService.getOrdersByEmail("kunde2@example.com");

        // assert
        assertThat(orders).isNotEmpty();
        assertThat(orders.get(0).getCustomerEmail()).isEqualTo("kunde2@example.com");
    }
}
