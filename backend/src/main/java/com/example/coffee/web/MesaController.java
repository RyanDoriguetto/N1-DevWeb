// src/main/java/com/example/coffee/web/MesaController.java
package com.example.coffee.web;

import com.example.coffee.service.MesaService;
import com.example.coffee.web.dto.MesaDetalhesDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mesas")
@CrossOrigin(origins = "*")
public class MesaController {

    private final MesaService mesaService;

    public MesaController(MesaService mesaService) {
        this.mesaService = mesaService;
    }

    // --------------------------------------------------------------------
    // LISTA APENAS OS NÚMEROS DAS MESAS (ex.: [1,2,3,...])
    // --------------------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<Integer>> listarMesas() {
        return ResponseEntity.ok(mesaService.listarMesasNumeros());
    }

    // --------------------------------------------------------------------
    // DETALHES DE UMA MESA ESPECÍFICA
    // --------------------------------------------------------------------
    @GetMapping("/{numeroMesa}/detalhes")
    public ResponseEntity<MesaDetalhesDTO> getDetalhesMesa(@PathVariable Integer numeroMesa) {
        try {
            return ResponseEntity.ok(mesaService.buscarDetalhesMesa(numeroMesa));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --------------------------------------------------------------------
    // ENCERRAR TODOS OS PEDIDOS ATIVOS DA MESA
    // --------------------------------------------------------------------
    @PostMapping("/{numeroMesa}/encerrar")
    public ResponseEntity<Void> encerrarMesa(@PathVariable Integer numeroMesa) {
        try {
            mesaService.encerrarMesa(numeroMesa);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --------------------------------------------------------------------
    // LISTA NÚMEROS DAS MESAS OCUPADAS (com pedidos ativos)
    // GET /api/mesas/ocupadas -> [1, 3, 7...]
    // --------------------------------------------------------------------
    @GetMapping("/ocupadas")
    public ResponseEntity<List<Integer>> listarMesasOcupadas() {
        return ResponseEntity.ok(mesaService.listarMesasOcupadas());
    }

    // --------------------------------------------------------------------
    // CANCELAR UM ITEM ESPECÍFICO
    // DELETE /api/mesas/itens/{itemId}
    // --------------------------------------------------------------------
    @DeleteMapping("/itens/{itemId}")
    public ResponseEntity<Void> cancelarItem(@PathVariable Long itemId) {
        try {
            mesaService.cancelarItem(itemId); // usa a regra única no service
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
