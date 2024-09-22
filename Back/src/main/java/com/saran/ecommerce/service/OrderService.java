package com.saran.ecommerce.service;

import org.springframework.validation.annotation.Validated;

import com.saran.ecommerce.model.Order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Validated
public interface OrderService {

    @NotNull Iterable<Order> getAllOrders();

    Order create(@NotNull(message = "The order cannot be null.") @Valid Order order);

    void update(@NotNull(message = "The order cannot be null.") @Valid Order order);
}
    //racuna ukupnu cenu svih proizvoda i menja status porudzbine//