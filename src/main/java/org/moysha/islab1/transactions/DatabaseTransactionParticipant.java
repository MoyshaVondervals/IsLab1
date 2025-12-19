package org.moysha.islab1.transactions;

import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

public class DatabaseTransactionParticipant implements TwoPhaseCommitParticipant {

    @FunctionalInterface
    public interface TransactionCallback {
        void doInTransaction() throws Exception;
    }

    private final PlatformTransactionManager transactionManager;
    private final TransactionCallback callback;
    private final TransactionDefinition definition;
    private TransactionStatus status;

    public DatabaseTransactionParticipant(PlatformTransactionManager transactionManager,
                                          TransactionCallback callback,
                                          int isolationLevel) {
        this.transactionManager = transactionManager;
        this.callback = callback;
        DefaultTransactionDefinition def = new DefaultTransactionDefinition();
        def.setName("dragon-import");
        def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
        def.setIsolationLevel(isolationLevel);
        this.definition = def;
    }

    @Override
    public void prepare() throws Exception {
        status = transactionManager.getTransaction(definition);
        callback.doInTransaction();
    }

    @Override
    public void commit() {
        if (status != null && !status.isCompleted()) {
            transactionManager.commit(status);
        }
    }

    @Override
    public void rollback() {
        if (status != null && !status.isCompleted()) {
            transactionManager.rollback(status);
        }
    }
}
