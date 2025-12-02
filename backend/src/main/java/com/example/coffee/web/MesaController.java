// src/main/java/com/example/coffee/web/MesaController.java
package com.example.coffee.web;

import com.example.coffee.service.MesaService;
import com.example.coffee.web.dto.MesaDetalhesDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mesas")
public class MesaController {

    private final MesaService mesaService;

    public MesaController(MesaService mesaService) {
        this.mesaService = mesaService;
    }

    // LISTA APENAS OS NÚMEROS DAS MESAS ATIVAS (ex.: [1,2,3])
    @GetMapping
    public ResponseEntity<List<Integer>> listarMesas() {
        return ResponseEntity.ok(mesaService.listarMesasNumeros());
    }

    @GetMapping("/{numeroMesa}/detalhes")
    public ResponseEntity<MesaDetalhesDTO> getDetalhesMesa(@PathVariable Integer numeroMesa) {
        try {
            return ResponseEntity.ok(mesaService.buscarDetalhesMesa(numeroMesa));
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
