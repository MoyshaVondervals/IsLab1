package org.moysha.islab1.transactions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class TwoPhaseCommitManager {

    private static final Logger log = LoggerFactory.getLogger(TwoPhaseCommitManager.class);

    private final List<TwoPhaseCommitParticipant> participants;

    public TwoPhaseCommitManager(List<TwoPhaseCommitParticipant> participants) {
        this.participants = participants;
    }

    public void execute() throws Exception {
        List<TwoPhaseCommitParticipant> prepared = new ArrayList<>();
        try {
            for (TwoPhaseCommitParticipant participant : participants) {
                participant.prepare();
                prepared.add(participant);
            }
        } catch (Exception prepareException) {
            rollbackParticipants(prepared);
            throw prepareException;
        }

        List<TwoPhaseCommitParticipant> committed = new ArrayList<>();
        try {
            for (TwoPhaseCommitParticipant participant : prepared) {
                participant.commit();
                committed.add(participant);
            }
        } catch (Exception commitException) {
            rollbackParticipants(committed);
            rollbackParticipants(prepared, committed);
            throw commitException;
        }
    }

    private void rollbackParticipants(List<TwoPhaseCommitParticipant> targets) {
        rollbackParticipants(targets, Collections.emptyList());
    }

    private void rollbackParticipants(List<TwoPhaseCommitParticipant> targets,
                                      List<TwoPhaseCommitParticipant> exclude) {
        List<TwoPhaseCommitParticipant> reversed = new ArrayList<>(targets);
        Collections.reverse(reversed);
        for (TwoPhaseCommitParticipant participant : reversed) {
            if (exclude.contains(participant)) {
                continue;
            }
            try {
                participant.rollback();
            } catch (Exception rollbackEx) {
                log.warn("Rollback failed for participant {}", participant.getClass().getSimpleName(), rollbackEx);
            }
        }
    }
}
