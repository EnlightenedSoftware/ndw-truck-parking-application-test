package org.ndw.myapp.service.impl;

import java.util.Optional;
import org.ndw.myapp.domain.Parking;
import org.ndw.myapp.repository.ParkingRepository;
import org.ndw.myapp.service.ParkingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Parking}.
 */
@Service
@Transactional
public class ParkingServiceImpl implements ParkingService {

    private final Logger log = LoggerFactory.getLogger(ParkingServiceImpl.class);

    private final ParkingRepository parkingRepository;

    public ParkingServiceImpl(ParkingRepository parkingRepository) {
        this.parkingRepository = parkingRepository;
    }

    @Override
    public Parking save(Parking parking) {
        log.debug("Request to save Parking : {}", parking);
        return parkingRepository.save(parking);
    }

    @Override
    public Parking update(Parking parking) {
        log.debug("Request to save Parking : {}", parking);
        return parkingRepository.save(parking);
    }

    @Override
    public Optional<Parking> partialUpdate(Parking parking) {
        log.debug("Request to partially update Parking : {}", parking);

        return parkingRepository
            .findById(parking.getId())
            .map(existingParking -> {
                if (parking.getName() != null) {
                    existingParking.setName(parking.getName());
                }
                if (parking.getLocation() != null) {
                    existingParking.setLocation(parking.getLocation());
                }
                if (parking.getPlaces() != null) {
                    existingParking.setPlaces(parking.getPlaces());
                }
                if (parking.getRefrigeratedPlaces() != null) {
                    existingParking.setRefrigeratedPlaces(parking.getRefrigeratedPlaces());
                }
                if (parking.getLzvPlaces() != null) {
                    existingParking.setLzvPlaces(parking.getLzvPlaces());
                }
                if (parking.getHourlyRate() != null) {
                    existingParking.setHourlyRate(parking.getHourlyRate());
                }
                if (parking.getPricingUrl() != null) {
                    existingParking.setPricingUrl(parking.getPricingUrl());
                }
                if (parking.getOtherServicesDescription() != null) {
                    existingParking.setOtherServicesDescription(parking.getOtherServicesDescription());
                }
                if (parking.getOrganization() != null) {
                    existingParking.setOrganization(parking.getOrganization());
                }
                if (parking.getCreatedOn() != null) {
                    existingParking.setCreatedOn(parking.getCreatedOn());
                }
                if (parking.getCreatedBy() != null) {
                    existingParking.setCreatedBy(parking.getCreatedBy());
                }
                if (parking.getUpdatedOn() != null) {
                    existingParking.setUpdatedOn(parking.getUpdatedOn());
                }
                if (parking.getUpdatedBy() != null) {
                    existingParking.setUpdatedBy(parking.getUpdatedBy());
                }
                if (parking.getIsActive() != null) {
                    existingParking.setIsActive(parking.getIsActive());
                }

                return existingParking;
            })
            .map(parkingRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Parking> findAll(Pageable pageable) {
        log.debug("Request to get all Parkings");
        return parkingRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Parking> findOne(Long id) {
        log.debug("Request to get Parking : {}", id);
        return parkingRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Parking : {}", id);
        parkingRepository.deleteById(id);
    }
}
