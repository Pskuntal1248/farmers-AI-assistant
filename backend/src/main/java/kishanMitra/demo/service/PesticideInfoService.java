package kishanMitra.demo.service;

import kishanMitra.demo.dto.PesticideProfile;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PesticideInfoService {

    public List<PesticideProfile> getPesticideProfiles() {
        return List.of(
                build("Imidacloprid 17.8% SL", "Aphids, Whiteflies, Jassids", "Cotton, Vegetables", "Neonicotinoid (IRAC 4A)", "Moderate; avoid during flowering", "7 days", "Apply early; rotate MoA"),
                build("Chlorantraniliprole 18.5% SC", "Stem borer, Leaf folder", "Rice, Maize", "IRAC 28", "Low mammalian toxicity", "10-14 days", "Target early larvae; good residual"),
                build("Mancozeb 75% WP", "Fungal blights and spots", "Potato, Tomato, Vegetables", "FRAC M03 (multi-site)", "Low-Moderate", "7 days", "Preventive use; rotate with systemics"),
                build("Azadirachtin 0.15% EC (Neem)", "Soft-bodied insects", "Multiple crops", "Botanical, multiple actions", "Low", "0-3 days", "IPM-friendly; frequent light sprays")
        );
    }

    private PesticideProfile build(String name, String target, String crop, String moa, String tox, String phi, String notes) {
        PesticideProfile p = new PesticideProfile();
        p.setName(name);
        p.setTargetPest(target);
        p.setCrop(crop);
        p.setModeOfAction(moa);
        p.setToxicity(tox);
        p.setPreHarvestInterval(phi);
        p.setNotes(notes);
        return p;
    }
}

