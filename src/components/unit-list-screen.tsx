import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { PosIcon } from '@/components/pos-icon';
import { lookupService } from '@/services/lookup-service';
import { ApiUnit } from '@/types/api-types';

export const UnitListScreen: React.FC = () => {
  const [units, setUnits] = useState<ApiUnit[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [unitName, setUnitName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchUnits = useCallback(async () => {
    setLoading(true);
    try {
      const res = await lookupService.getUnits();
      if (res.data && Array.isArray(res.data)) {
        setUnits(res.data);
      } else {
        setUnits([]);
      }
    } catch {
      setUnits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const handleCreate = async () => {
    if (!unitName.trim()) return;
    setSubmitting(true);
    try {
      // API 16: POST /api/v1/units
      const res = await lookupService.createUnit(unitName.trim());
      if (res.error === 'False' || res.code === '200') {
        setUnitName('');
        setModalVisible(false);
        fetchUnits();
      } else {
        Alert.alert('Notice', res.message || 'Saved');
        fetchUnits();
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <View className="m-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4">
        <View className="flex-row items-center justify-between pb-3 border-b border-slate-200 mb-3">
          <View>
            <Text className="text-slate-800 text-lg font-bold">Units of Measure (API 15-18)</Text>
            <Text className="text-slate-400 text-xs">Live units retrieved from backend</Text>
          </View>
          <Pressable
            onPress={() => setModalVisible(true)}
            className="bg-emerald-600 px-3.5 py-1.5 rounded-lg flex-row items-center gap-1.5 active:bg-emerald-700 shadow-sm">
            <PosIcon name="plus" size={13} color="#FFFFFF" />
            <Text className="text-white text-xs font-bold">Add Unit</Text>
          </Pressable>
        </View>

        {loading ? (
          <View className="py-10 items-center justify-center">
            <ActivityIndicator size="small" color="#059669" />
            <Text className="text-xs text-slate-400 mt-2">Loading units from API...</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="min-w-[450px]">
              <View className="flex-row bg-slate-100/70 border-b border-slate-200 py-2.5 px-3">
                <Text className="w-12 text-[11px] font-bold text-slate-700"># ID</Text>
                <Text className="w-36 text-[11px] font-bold text-slate-700">Unit</Text>
                <Text className="w-20 text-[11px] font-bold text-slate-700">Quantity</Text>
                <Text className="w-24 text-[11px] font-bold text-slate-700">Company</Text>
                <Text className="w-20 text-[11px] font-bold text-slate-700">Status</Text>
              </View>

              {units.length === 0 ? (
                <View className="p-4">
                  <Text className="text-xs text-slate-400">No units found in API.</Text>
                </View>
              ) : (
                units.map((u) => (
                  <View key={u.id} className="flex-row items-center py-2.5 px-3 border-b border-slate-100">
                    <Text className="w-12 text-xs font-mono text-slate-500">#{u.id}</Text>
                    <Text className="w-36 text-xs font-bold text-slate-800">{u.unit}</Text>
                    <Text className="w-20 text-xs text-slate-600 font-mono">{u.qty || '1'}</Text>
                    <Text className="w-24 text-xs text-slate-600">{u.company || '4'}</Text>
                    <View className="w-20">
                      <View className="bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full self-start">
                        <Text className="text-[10px] text-emerald-700 font-semibold">Active</Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Add Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-black/50 justify-center p-5">
          <View className="bg-white rounded-2xl p-5 shadow-xl">
            <Text className="text-base font-bold text-slate-900 mb-3">Add Unit (API 16)</Text>
            <TextInput
              value={unitName}
              onChangeText={setUnitName}
              placeholder="e.g. Piece, KG, Box"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 mb-4"
            />
            <View className="flex-row justify-end gap-2">
              <Pressable onPress={() => setModalVisible(false)} className="px-4 py-2 rounded-lg bg-slate-100">
                <Text className="text-xs text-slate-600 font-semibold">Cancel</Text>
              </Pressable>
              <Pressable onPress={handleCreate} disabled={submitting} className="px-4 py-2 rounded-lg bg-emerald-600 active:bg-emerald-700">
                {submitting ? <ActivityIndicator size="small" color="#FFF" /> : <Text className="text-xs text-white font-bold">Save</Text>}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
