package org.moysha.islab1.services;

import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.moysha.islab1.models.Location;
import org.moysha.islab1.repositories.LocationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationService {
    private final LocationRepository locationRepository;

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
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


}
