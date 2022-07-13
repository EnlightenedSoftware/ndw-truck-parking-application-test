package org.ndw.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.ndw.myapp.web.rest.TestUtil;

class ParkingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Parking.class);
        Parking parking1 = new Parking();
        parking1.setId(1L);
        Parking parking2 = new Parking();
        parking2.setId(parking1.getId());
        assertThat(parking1).isEqualTo(parking2);
        parking2.setId(2L);
        assertThat(parking1).isNotEqualTo(parking2);
        parking1.setId(null);
        assertThat(parking1).isNotEqualTo(parking2);
    }
}
