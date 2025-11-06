package com.example.coffee.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.coffee.service.MesaService;
import com.example.coffee.web.dto.MesaDetalhesDTO;

@RestController
@RequestMapping("/api/mesas")
public class MesaController {

    @Autowired
    private MesaService mesaService;

    @GetMapping("/{numeroMesa}/detalhes")
    public ResponseEntity<MesaDetalhesDTO> getDetalhesMesa(@PathVariable Integer numeroMesa) {
        try {
            MesaDetalhesDTO detalhes = mesaService.buscarDetalhesMesa(numeroMesa);
            return ResponseEntity.ok(detalhes);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{numeroMesa}/encerrar")
    public ResponseEntity<Void> encerrarMesa(@PathVariable Integer numeroMesa) {
        try {
            mesaService.encerrarMesa(numeroMesa);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}