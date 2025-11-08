package org.moysha.islab1.services;

import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.moysha.islab1.dto.LocationDTO;
import org.moysha.islab1.models.Location;
import org.moysha.islab1.repositories.LocationRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationService {
    private final LocationRepository locationRepository;

    public List<LocationDTO> getAllLocations() {
        List<Location> locations = locationRepository.findAll();
        List<LocationDTO> dto = new ArrayList<>();
        for (Location location : locations) {
            dto.add(LocationDTO.builder()
                            .id(location.getId())
                    .x(location.getX())
                    .y(location.getY())
                    .z(location.getZ()).build());
        }
        return dto;
    }

    public Location getLocationById(long id) {
        return locationRepository.findById(id);
    }

    public Location save(Location location) {
        return locationRepository.save(location);
    }

    public Location getById(long id) {
        return locationRepository.findById(id);

    }

    public boolean existsById(long id) {
        return locationRepository.existsById(id);
    }

}
