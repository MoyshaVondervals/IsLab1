package org.moysha.islab1.transactions;

public interface TwoPhaseCommitParticipant {

    void prepare() throws Exception;

    void commit() throws Exception;

    void rollback();
}
