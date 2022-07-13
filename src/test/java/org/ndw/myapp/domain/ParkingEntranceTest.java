package org.ndw.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.ndw.myapp.web.rest.TestUtil;

class ParkingEntranceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ParkingEntrance.class);
        ParkingEntrance parkingEntrance1 = new ParkingEntrance();
        parkingEntrance1.setId(1L);
        ParkingEntrance parkingEntrance2 = new ParkingEntrance();
        parkingEntrance2.setId(parkingEntrance1.getId());
        assertThat(parkingEntrance1).isEqualTo(parkingEntrance2);
        parkingEntrance2.setId(2L);
        assertThat(parkingEntrance1).isNotEqualTo(parkingEntrance2);
        parkingEntrance1.setId(null);
        assertThat(parkingEntrance1).isNotEqualTo(parkingEntrance2);
    }
}
