package com.saran.ecommerce.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.saran.ecommerce.dto.OrderProductDto;
import com.saran.ecommerce.model.Order;
import com.saran.ecommerce.model.OrderProduct;
import com.saran.ecommerce.model.OrderStatus;
import com.saran.ecommerce.service.OrderProductService;
import com.saran.ecommerce.service.OrderService;
import com.saran.ecommerce.service.ProductService;

import jakarta.validation.constraints.NotNull;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    ProductService productService;
    OrderService orderService;
    OrderProductService orderProductService;

    public OrderController(ProductService productService, OrderService orderService, OrderProductService orderProductService) {
        this.productService = productService;
        this.orderService = orderService;
        this.orderProductService = orderProductService;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public @NotNull Iterable<Order> list() {
        return this.orderService.getAllOrders();
    }

    @PostMapping
    public ResponseEntity<Order> create(@RequestBody OrderForm form) {//prima listu productOrdera
        List<OrderProductDto> formDtos = form.getProductOrders();
        System.out.println((form.getProductOrders()));
        Order order = new Order();
        order.setStatus(OrderStatus.PAID.name());
        order = this.orderService.create(order);//pozivamo create iz orderService koja kreira datum ordera dodaje se id

        List<OrderProduct> orderProducts = new ArrayList<>();
        for (OrderProductDto dto : formDtos) {
            orderProducts.add(orderProductService.create(new OrderProduct(order, productService.getProduct(dto
              .getProduct()
              .getId()), dto.getQuantity())));
        }

        order.setOrderProducts(orderProducts);// setujemo orderProduts u orderu

        this.orderService.update(order); //updejutujemo order jer je bio null sad mu dajemo vrednosti

        return new ResponseEntity<>(order, HttpStatus.CREATED); //kreiramo kako izgleda reponse
    }


    public static class OrderForm {

        private List<OrderProductDto> productOrders;

        public List<OrderProductDto> getProductOrders() {
            return productOrders;
        }

        public void setProductOrders(List<OrderProductDto> productOrders) {
            this.productOrders = productOrders;
        }
            //front salje podatke o narudzbini koji idu u OrederService//
    }
}
