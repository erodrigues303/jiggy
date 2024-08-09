package com.example.demo.service;

import com.example.demo.model.Clothes;
import com.example.demo.repository.ClothesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClothesService {

    @Autowired
    private ClothesRepository clothesRepository;

    public List<Clothes> getAllClothes() {
        return clothesRepository.findAll();
    }

    public Optional<Clothes> getClothesById(int id) {
        return clothesRepository.findById(id);
    }

    public Clothes saveClothes(Clothes clothes) {
        return clothesRepository.save(clothes);
    }

    public void deleteClothes(int id) {
        clothesRepository.deleteById(id);
    }
}